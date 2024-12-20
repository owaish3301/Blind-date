import { useNavigate } from 'react-router-dom';
import { formPages } from './FormPages';
import { useQuestionnaire } from './useQuestionnaire';
import FormField from './FormField';

function QuestionnaireForm() {
  const navigate = useNavigate();
  const {
    currentPage,
    formData,
    errors,
    isSubmitting,
    submitError,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit
  } = useQuestionnaire();

  const currentPageData = formPages[currentPage];

  const onNext = async () => {
    if (currentPage === formPages.length - 1) {
      const success = await handleSubmit();
      if (success) {
        navigate('/home');
      }
    } else {
      handleNext(currentPageData.fields);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
      style={{
        backgroundColor: '#FFE4E1',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff9eaa' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-lg border-4 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0_0_#000] transition-all duration-200">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-pink-100 rounded-full">
              <div 
                className="h-2 bg-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentPage + 1) / formPages.length) * 100}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              Step {currentPage + 1} of {formPages.length}
            </p>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="heart-container">
              <div className="heart text-5xl">❤️</div>
            </div>
            <h1 className="text-3xl font-bold mt-4">{currentPageData.title}</h1>
            {submitError && (
              <p className="text-red-500 mt-2">{submitError}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {currentPageData.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleInputChange}
                error={errors[field.name]}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_0_#000] transition-all duration-200"
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-3 bg-pink-500 text-white font-bold rounded border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_0_#000] transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 
                currentPage === formPages.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnaireForm;